import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by bowang on 11/11/16.
 */
public class tester {
    public static void main(String[] args) throws IOException {
        File file = new File("/Users/bowang/Downloads/esbuildfile.json");
        Scanner reader = new Scanner(new FileInputStream(file));
        HashMap<String, Integer> map = new HashMap<>();
        while(reader.hasNextLine()) {
            JSONObject jsonObject = null;
            try {
                jsonObject = new JSONObject(reader.nextLine());

                String time = jsonObject.get("date").toString();
                SimpleDateFormat format = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss Z (z)");
                Date date = null;
                try {
                    date = format.parse(time);
                } catch (ParseException e) {
                   continue;
                }
            //JSONArray jsonArray = new JSONArray();
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("from", jsonObject.get("from").toString());
                jsonObj.put("to", jsonObject.get("to").toString());
                jsonObj.put("date", jsonObject.get("date").toString());
                jsonObj.put("x-from", jsonObject.get("x-from").toString());
                jsonObj.put("x-to", jsonObject.get("x-to").toString());
             //   jsonObj.put("noun", jsonObject.get("noun").toString());
            //jsonArray.put(jsonObj);

                String y = new SimpleDateFormat("yyyy").format(date).toString();
                File f = new File("#" + y);
                FileWriter writer = new FileWriter(f, true);
                writer.append(jsonObj.toString() + "\n");
                writer.close();

            } catch (JSONException e) {
                continue;
               // e.printStackTrace();
            }
        }
    }

}
