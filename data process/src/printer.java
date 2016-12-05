

import org.json.JSONException;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.JSONArray;
import java.io.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Scanner;

/**
 * Created by bowang on 11/22/16.
 */
public class printer {


    private static class People implements Comparable<People>{
        public String email;
        public int to, from;
        public People(String email, int to, int from) {
            this.email = email;
            this.to = to;
            this.from = from;
        }

        @Override
        public int compareTo(People o) {
            return 0 - this.to - this.from + o.to + o.from;
        }
    }

    public static void main(String[] args) throws IOException, ParseException, JSONException, org.json.simple.parser.ParseException {
        //File file = new File("raw");
        JSONParser parser = new JSONParser();
        JSONArray array = (JSONArray)parser.parse(new FileReader("raw"));

        HashMap<String, Integer> to = new HashMap<>();
        HashMap<String, Integer> from = new HashMap<>();
        for (int i = 0; i < array.size(); i++) {
            JSONObject object = (JSONObject) array.get(i);
            if (to.containsKey(object.get("from").toString())) {
                to.put(object.get("from").toString(), to.get(object.get("from").toString()) + 1);
            } else {
                to.put(object.get("from").toString(), 1);
            }

            JSONArray a = (JSONArray) object.get("to");
            for (int j = 0; j < a.size(); j++) {
                if (from.containsKey(a.get(j).toString())){
                    from.put(a.get(j).toString(), from.get(a.get(j).toString()) + 1);
                } else {
                    from.put(a.get(j).toString(), 1);
                }
            }
        }

        FileWriter writer = new FileWriter(new File("50tofrom"));
        for (String k : to.keySet()){
            writer.append(k + " " + to.get(k) + " " + from.get(k) + "\n");
        }
        writer.close();
    }
}
