import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.util.*;

/**
 * Created by bowang on 12/3/16.
 */
public class ppv {
    public static void main(String[] args) throws IOException, JSONException {
        //File
        File email = new File("emails");

        Scanner scanner = new Scanner(new FileInputStream(email));
        List<String> pList = new ArrayList<>();
        HashMap<String, Integer> map = new HashMap<>();
        int count = 0;
        while (scanner.hasNextLine()){
            String s = scanner.nextLine();
            pList.add(s.trim());
            map.put(s.trim(),count++);
        }
        int[][] matrix = new int[pList.size()][pList.size()];
        System.out.println(pList.size());
        File input = new File("Jan");
        File ouput = new File("JanPPV");
        StringBuilder sb = new StringBuilder();
        Scanner scanner1  = new Scanner(new FileInputStream(input));
        while(scanner1.hasNextLine()){
            sb.append(scanner1.nextLine());
        }
        JSONArray jsonArray = new JSONArray(sb.toString());
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject obj = (JSONObject) jsonArray.get(i);
            int m = map.get(obj.get("from").toString());
            JSONArray array = (JSONArray) obj.get("to");
            for (int j = 0; j < array.length(); j++) {
                int n = map.get(array.get(j).toString());
                matrix[n][m]++;
                matrix[m][n]++;
            }
        }

        FileWriter writer = new FileWriter(ouput);
        writer.append('[');
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[0].length; j++) {
                JSONObject obj1 = new JSONObject();
                obj1.put("name1", pList.get(i));
                obj1.put("name2", pList.get(j));
                obj1.put("vol", matrix[i][j]);
                writer.write(obj1.toString() + ",\n");
                if(i == j) {
                    continue;
                }
                JSONObject obj2 = new JSONObject();
                obj2.put("name1", pList.get(j));
                obj2.put("name2", pList.get(i));
                obj2.put("vol", matrix[j][i]);
                writer.write(obj2.toString() + ",\n");
            }
        }
        writer.close();

    }
}
